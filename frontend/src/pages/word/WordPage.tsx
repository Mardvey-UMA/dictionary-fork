import { useCourseDetails } from '@/hooks/api/course.hooks'
import { useWordDetails } from '@/hooks/api/word.hooks'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Card, Skeleton, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { MediaPlayer } from './components/MediaPlayer'
import { WordNavigation } from './components/WordNavigation'
import './WordPage.scss'

const { Title, Paragraph } = Typography

export const WordPage = () => {
	const { id, courseId } = useParams<{ id: string; courseId: string }>()
	const navigate = useNavigate()
	const { data: word, isLoading: isWordLoading } = useWordDetails(Number(id))
	const { data: course, isLoading: isCourseLoading } = useCourseDetails(
		Number(courseId)
	)

	const handleBackToCourse = () => {
		if (courseId) {
			navigate(`/course/${courseId}`)
		} else {
			navigate('/courses')
		}
	}

	if (isWordLoading || isCourseLoading) {
		return <Skeleton active />
	}

	if (!word) {
		return <div>Слово не найдено</div>
	}

	// Get all words from all levels in the course
	const allCourseWords = course?.levels.flatMap(level => level.words) ?? []

	return (
		<div className='word-page'>
			<Card className='word-card'>
				<div className='word-header'>
					<Button icon={<ArrowLeftOutlined />} onClick={handleBackToCourse}>
						Вернуться к курсу
					</Button>
				</div>

				<div className='word-content'>
					<Title level={2}>{word.word}</Title>
					<Paragraph className='definition'>{word.definition}</Paragraph>

					<div className='media-section'>
						{word.audioPath && (
							<div className='media-item'>
								<Title level={4}>Аудио произношение</Title>
								<MediaPlayer type='audio' src={word.audioPath} />
							</div>
						)}

						{word.videoPath && (
							<div className='media-item'>
								<Title level={4}>Видео</Title>
								<MediaPlayer type='video' src={word.videoPath} />
							</div>
						)}

						{word.imagePath && (
							<div className='media-item'>
								<Title level={4}>Изображение</Title>
								<img
									src={word.imagePath}
									alt={word.word}
									className='word-image'
								/>
							</div>
						)}
					</div>
				</div>

				{allCourseWords.length > 0 && (
					<WordNavigation
						currentWordId={word.id}
						words={allCourseWords}
						courseId={Number(courseId)}
					/>
				)}
			</Card>
		</div>
	)
}