import type { WordResponseDTO } from '@/shared/types/word'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import './WordNavigation.scss'

const { Text } = Typography

interface WordNavigationProps {
	currentWordId: number
	words: WordResponseDTO[]
	courseId: number
}

export const WordNavigation = ({
	currentWordId,
	words,
	courseId,
}: WordNavigationProps) => {
	const navigate = useNavigate()

	if (!words?.length) {
		return (
			<div className='word-navigation'>
				<Text type='secondary'>Нет доступных слов для навигации</Text>
			</div>
		)
	}

	const currentIndex = words.findIndex(word => word.id === currentWordId)
	const prevWord = words[currentIndex - 1]
	const nextWord = words[currentIndex + 1]

	return (
		<div className='word-navigation'>
			<div className='navigation-buttons'>
				{prevWord && (
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate(`/course/${courseId}/word/${prevWord.id}`)}
					>
						Предыдущее слово
					</Button>
				)}
				{nextWord && (
					<Button
						type='primary'
						icon={<ArrowRightOutlined />}
						onClick={() => navigate(`/course/${courseId}/word/${nextWord.id}`)}
					>
						Следующее слово
					</Button>
				)}
			</div>
		</div>
	)
}