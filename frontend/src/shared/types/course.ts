import type { LevelResponseDTO } from './level'
import type { UserResponseDTO } from './user'

export type CourseRequestDTO = {
	title: string
	description?: string
	imageFile?: File
}

export type CourseResponseDTO = {
	id: number
	title: string
	description?: string
	author: UserResponseDTO
	levels: LevelResponseDTO[]
	participants: UserResponseDTO[]
	createdAt: string
	progress?: number
	imagePath: string
}

export type CourseJoinDTO = {
	courseId: number
}

export type CourseSearchParams = {
	query: string
}

export type CourseUserProgressDTO = {
	user: UserResponseDTO
	averageProgress: number
}
