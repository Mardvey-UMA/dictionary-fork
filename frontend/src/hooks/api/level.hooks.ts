import { levelService } from '@/services/api/level.service'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import type { LevelRequestDTO } from '@/shared/types/level'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useLevels = (courseId?: number) => {
	return useQuery({
		queryKey: [...QUERY_KEYS.LEVELS, courseId],
		queryFn: () => levelService.getAllLevels(courseId),
		enabled: !!courseId,
	})
}

export const useLevelDetails = (id: number) => {
	return useQuery({
		queryKey: QUERY_KEYS.LEVEL_DETAILS(id),
		queryFn: () => levelService.getLevelById(id),
	})
}

export const useCreateLevel = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: LevelRequestDTO) => levelService.createLevel(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEVELS })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES })
		},
	})
}

export const useUpdateLevel = (id: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: LevelRequestDTO) => levelService.updateLevel(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEVELS })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEVEL_DETAILS(id) })
		},
	})
}

export const useDeleteLevel = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => levelService.deleteLevel(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEVELS })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES })
			queryClient.removeQueries({ queryKey: QUERY_KEYS.LEVEL_DETAILS(id) })
		},
	})
}
