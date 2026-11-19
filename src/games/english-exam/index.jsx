import { useEffect, useState } from 'react'
import { useUser } from '../../hooks/useUser'
import EducationalInfoModal from '../../components/EducationalInfoModal.jsx'
import { games } from '../../data/games.js'
import {
  ACTIVITIES,
  activitiesFor,
  findTopic,
  isWritable,
  mistakeKey,
  modelFor,
  promptFor,
  TOPICS,
} from './data/topics.js'
import { buildExam, questionCards } from './data/exam.js'
import { SettingsContext, shuffle, starsFor, useProgress } from './utils/progress.js'
import { heardAny, stopSpeaking } from './utils/speech.js'
import MapScreen, { TopicScreen } from './components/MapScreen.jsx'
import ParentsPanel from './components/ParentsPanel.jsx'
import LearnActivity from './components/LearnActivity.jsx'
import QuizRunner from './components/QuizRunner.jsx'
import ListenQuestion from './components/ListenQuestion.jsx'
import WriteQuestion from './components/WriteQuestion.jsx'
import SpeakQuestion from './components/SpeakQuestion.jsx'
import ExamQuestion from './components/ExamQuestion.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import { BigButton, Card, En, SmallButton } from './components/ui.jsx'

// Each activity run gets a fresh id so its components remount with new questions.
let runSeq = 0
const nextRunId = () => ++runSeq

const QUESTIONS_PER_ACTIVITY = 6
const REVIEW_QUESTIONS = 8

// Easier first topics show 3 pictures to choose from; later ones show 4.
const optionCountFor = (topicId) => (TOPICS.findIndex((t) => t.id === topicId) < 3 ? 3 : 4)

function wordChoices(item, pool) {
  return shuffle([item, ...shuffle(pool.filter((i) => i.en !== item.en)).slice(0, 2)]).map((i) => ({
    label: i.en,
    value: i.en,
    ok: i.en === item.en,
  }))
}

function makeQuestion(type, topic, item) {
  const q = { type, topicId: topic.id, item }
  if (type === 'speak') q.choices = wordChoices(item, topic.items)
  return q
}

function buildActivity(topic, activity, { userName, age }) {
  if (activity === 'learn') {
    if (topic.special === 'questions') return { cards: questionCards({ userName, age }) }
    return {
      cards: topic.items.map((item) => ({
        v: item,
        en: item.en,
        es: item.es,
        alts: item.alts,
        sentence: topic.frame ? modelFor(topic, item) : null,
      })),
    }
  }
  if (activity === 'practice') {
    return { questions: buildExam({ userName, age, practice: true }).map((q) => ({ type: 'exam', q })) }
  }
  const pool = activity === 'write' ? topic.items.filter(isWritable) : topic.items
  return {
    questions: shuffle(pool)
      .slice(0, QUESTIONS_PER_ACTIVITY)
      .map((item) => makeQuestion(activity, topic, item)),
  }
}

// Mixed review weighted towards the words that were missed most.
function buildReview(progress) {
  const regular = TOPICS.filter((t) => !t.special)
  const practised = regular.filter((t) => progress.topics[t.id]?.listen)
  // Nothing practised yet (new player or cleared browser data): review everything.
  const candidates = (practised.length ? practised : regular).flatMap((topic) =>
    topic.items.map((item) => ({ topic, item, weight: 1 + 3 * (progress.mistakes[mistakeKey(topic.id, item.en)] || 0) })),
  )
  const picked = []
  while (picked.length < REVIEW_QUESTIONS && candidates.length) {
    const total = candidates.reduce((s, c) => s + c.weight, 0)
    let r = Math.random() * total
    const index = candidates.findIndex((c) => (r -= c.weight) < 0)
    picked.push(candidates.splice(index < 0 ? 0 : index, 1)[0])
  }
  return picked.map(({ topic, item }) => {
    const types = activitiesFor(topic).filter(
      (a) => a === 'listen' || a === 'speak' || (a === 'write' && isWritable(item)),
    )
    return makeQuestion(types[Math.floor(Math.random() * types.length)], topic, item)
  })
}

function renderQuestion(q, onAnswer) {
  if (q.type === 'exam') return <ExamQuestion q={q.q} onAnswer={onAnswer} />
  const topic = findTopic(q.topicId)
  const { item } = q
  if (q.type === 'listen') {
    return <ListenQuestion item={item} pool={topic.items} optionCount={optionCountFor(topic.id)} onAnswer={onAnswer} />
  }
  if (q.type === 'write') return <WriteQuestion item={item} onAnswer={onAnswer} />
  const prompt = promptFor(topic, item)
  return (
    <SpeakQuestion
      say={prompt.en}
      es={`${prompt.es} Respondé en inglés tocando el micrófono.`}
      visual={item}
      check={(alternatives) => ({ ok: heardAny(alternatives, [item.en, ...(item.alts || [])]), said: item.en })}
      model={() => modelFor(topic, item)}
      choices={q.choices}
      onAnswer={onAnswer}
    />
  )
}

export default function EnglishExam() {
  const { userName } = useUser()
  // Each player keeps separate progress; remount when the name changes.
  return <Game key={userName} userName={userName} />
}

function Game({ userName }) {
  const { addScore } = useUser()
  const { progress, saveStars, recordAnswer, saveExam, setSetting, resetProgress } = useProgress(userName)
  const { settings } = progress
  const [screen, setScreen] = useState({ name: 'map' })
  const gameData = games.find((g) => g.id === 'english-exam')

  useEffect(() => () => stopSpeaking(), [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen.name, screen.runId])

  const goMap = () => {
    stopSpeaking()
    setScreen({ name: 'map' })
  }
  const openTopic = (topicId) => {
    stopSpeaking()
    setScreen({ name: 'topic', topicId })
  }

  const startActivity = (topicId, activity) => {
    const topic = findTopic(topicId)
    setScreen({
      name: 'activity',
      topicId,
      activity,
      runId: nextRunId(),
      ...buildActivity(topic, activity, { userName, age: settings.age }),
    })
  }

  const startReview = () => setScreen({ name: 'review', runId: nextRunId(), questions: buildReview(progress) })

  const startExam = () =>
    setScreen({
      name: 'exam',
      runId: nextRunId(),
      questions: buildExam({ userName, age: settings.age }).map((q) => ({ type: 'exam', q })),
    })

  const onAnswer = (q, firstTry) => {
    if (q.item) recordAnswer(mistakeKey(q.topicId, q.item.en), firstTry)
  }

  const finishActivity = ({ correct, total }) => {
    const stars = total ? starsFor(correct, total) : 3
    saveStars(screen.topicId, screen.activity, stars)
    if (correct) addScore(correct)
    setScreen({ name: 'result', from: screen, stars, correct, total })
  }

  const finishReview = ({ correct, total }) => {
    if (correct) addScore(correct)
    setScreen({ name: 'result', from: screen, stars: starsFor(correct, total), correct, total })
  }

  const finishExam = ({ correct, total }) => {
    saveExam(correct)
    if (correct) addScore(correct)
    setScreen({ name: 'result', from: screen, stars: starsFor(correct, total), correct, total })
  }

  const exitBar = (title) => (
    <div className="flex items-center justify-between gap-3 mb-4">
      <SmallButton onClick={() => (screen.topicId ? openTopic(screen.topicId) : goMap())}>⬅️ Salir</SmallButton>
      <p className="text-lg sm:text-xl font-extrabold text-indigo-700 font-nunito text-right">{title}</p>
    </div>
  )

  let content
  if (screen.name === 'map') {
    content = (
      <MapScreen
        progress={progress}
        userName={userName}
        onTopic={openTopic}
        onReview={startReview}
        onExam={() => setScreen({ name: 'examIntro' })}
        onParents={() => setScreen({ name: 'parents' })}
      />
    )
  } else if (screen.name === 'parents') {
    content = (
      <ParentsPanel progress={progress} setSetting={setSetting} resetProgress={resetProgress} onBack={goMap} />
    )
  } else if (screen.name === 'topic') {
    content = (
      <TopicScreen
        topic={findTopic(screen.topicId)}
        progress={progress}
        activityInfo={ACTIVITIES}
        onActivity={(activity) => startActivity(screen.topicId, activity)}
        onBack={goMap}
      />
    )
  } else if (screen.name === 'activity') {
    const topic = findTopic(screen.topicId)
    const info = ACTIVITIES[screen.activity]
    content = (
      <>
        {exitBar(
          <>
            {topic.icon} <En>{topic.title}</En> · {info.icon} {info.title}
          </>,
        )}
        {screen.cards ? (
          <LearnActivity key={screen.runId} cards={screen.cards} onFinish={() => finishActivity({ correct: 0, total: 0 })} />
        ) : (
          <QuizRunner
            key={screen.runId}
            questions={screen.questions}
            renderQuestion={renderQuestion}
            onAnswer={onAnswer}
            onFinish={finishActivity}
          />
        )}
      </>
    )
  } else if (screen.name === 'review') {
    content = (
      <>
        {exitBar('🔁 Repaso rápido')}
        <QuizRunner
          key={screen.runId}
          questions={screen.questions}
          renderQuestion={renderQuestion}
          onAnswer={onAnswer}
          onFinish={finishReview}
        />
      </>
    )
  } else if (screen.name === 'examIntro') {
    content = (
      <Card className="text-center space-y-5">
        <div className="text-8xl">🎓</div>
        <h2 className="text-4xl font-extrabold text-indigo-800 font-nunito">Simulacro de examen</h2>
        <p className="text-xl text-gray-700 font-nunito">
          La maestra búho 🦉 te va a hacer <strong>20 preguntas</strong>, como el día del examen. Respondé en inglés
          con el micrófono 🎤, o hacé lo que te pide.
        </p>
        <p className="text-lg text-gray-500 font-nunito">
          Si no entendés, tocá «🔊 Escuchar» o «🐢 Despacio». Al final vas a ver cuántas respondiste bien.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <BigButton color="from-indigo-600 to-purple-700" onClick={startExam}>
            ¡Empezar! 🚀
          </BigButton>
          <SmallButton onClick={goMap}>⬅️ Volver</SmallButton>
        </div>
      </Card>
    )
  } else if (screen.name === 'exam') {
    content = (
      <>
        {exitBar('🎓 Simulacro de examen')}
        <QuizRunner key={screen.runId} questions={screen.questions} renderQuestion={renderQuestion} onFinish={finishExam} />
      </>
    )
  } else if (screen.name === 'result') {
    const { from } = screen
    let onAgain = null
    let onNext = null
    let nextLabel = null
    let onBack = goMap
    if (from.name === 'activity') {
      const topic = findTopic(from.topicId)
      const acts = activitiesFor(topic)
      const nextAct = acts[acts.indexOf(from.activity) + 1]
      onAgain = () => startActivity(from.topicId, from.activity)
      onBack = () => openTopic(from.topicId)
      if (nextAct) {
        onNext = () => startActivity(from.topicId, nextAct)
        nextLabel = `${ACTIVITIES[nextAct].icon} ${ACTIVITIES[nextAct].title}`
      } else {
        const nextTopic = TOPICS[TOPICS.indexOf(topic) + 1]
        if (nextTopic) {
          onNext = () => openTopic(nextTopic.id)
          nextLabel = `Siguiente tema: ${nextTopic.icon} ${nextTopic.es}`
        }
      }
    } else if (from.name === 'review') {
      onAgain = startReview
    } else if (from.name === 'exam') {
      onAgain = startExam
    }
    content = (
      <ResultScreen
        stars={screen.stars}
        correct={screen.correct}
        total={screen.total}
        onAgain={onAgain}
        onNext={onNext}
        nextLabel={nextLabel}
        onBack={onBack}
      />
    )
  }

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50">
        <EducationalInfoModal gameInfo={gameData?.educationalInfo} />
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">{content}</div>
      </div>
    </SettingsContext.Provider>
  )
}
