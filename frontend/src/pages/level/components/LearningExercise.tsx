import { useCheckAnswer } from '@/hooks/api/learn.hooks'
import type { LearningMaterialDTO } from '@/shared/types/learn'
import { SoundOutlined } from '@ant-design/icons'
import { Button, Grid, Progress, Typography } from 'antd'
import { useState } from 'react'
import './LearningExercise.scss'

const { Title, Text } = Typography
const { useBreakpoint } = Grid
const FEEDBACK_DELAY = 1500

interface Props {
  material?: LearningMaterialDTO
  onNext: () => void
  progress?: number
}

export const LearningExercise = ({ material, onNext, progress = 0 }: Props) => {
  const screens = useBreakpoint()
  const { mutate: checkAnswer } = useCheckAnswer()
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const isAudioToWord = material?.type === 'AUDIO_TO_WORD'
  const isWordToImage = material?.type === 'WORD_TO_IMAGE'
  const isImageToWord = material?.type === 'IMAGE_TO_WORD'

  const handleAnswer = (answer: string) => {
    if (!material || selected) return

    setSelected(answer)
    checkAnswer(
      { wordId: material.targetWord.id, answer, type: material.type },
      {
        onSuccess: res => {
          setIsCorrect(res.correct)
          setTimeout(() => {
            setSelected(null)
            setIsCorrect(null)
            onNext()
          }, FEEDBACK_DELAY)
        },
      }
    )
  }

  const handlePlayAudio = () => {
    if (material?.targetWord.audioPath) {
      new Audio(material.targetWord.audioPath).play()
    }
  }

  return (
    <div className="exercise-container">
      <div className="target-section">
        {isAudioToWord ? (
          <div className="audio-player">
            <Button
              type="primary"
              shape="circle"
              icon={<SoundOutlined />}
              size="large"
              onClick={handlePlayAudio}
            />
          </div>
        ) : isImageToWord ? (
          <img
            src={material?.targetWord.imagePath}
            alt="Target"
            className="target-image"
          />
        ) : (
          <Title level={2} className="target-word">
            {material?.targetWord.word}
          </Title>
        )}
      </div>

      <div className={`options-grid ${screens.md ? 'desktop' : ''}`}>
        {material?.options.map((option, index) => {
          const state = selected === option ? (isCorrect ? 'correct' : 'wrong') : undefined
          const feedback = state === 'correct' ? 'Правильно!' : 'Неверно'

          return (
            <Button
              key={index}
              className="option-button"
              disabled={!!selected}
              data-state={state}
              data-feedback={feedback}
              onClick={() => handleAnswer(option)}
            >
              {isWordToImage ? (
                <img src={option} alt="Option" className="image-option" />
              ) : (
                <span className="word-option">{option}</span>
              )}
            </Button>
          )
        })}
      </div>

      <div className="progress-section">
        <Text type="secondary">Общий прогресс</Text>
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            '0%': '#4f46e5',
            '100%': '#10b981',
          }}
        />
      </div>
    </div>
  )
}