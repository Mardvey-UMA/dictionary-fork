import type { UserResponseDTO, UserUpdateData } from '@/shared/types/user'
import { authAxios } from './index'

export const userService = {
	async updateUser(id: number, data: UserUpdateData) {
		const response = await authAxios.put<UserResponseDTO>(
			`/api/users/${id}`,
			data
		)
		return response.data
	},

	async getCurrentUser() {
		const response = await authAxios.get<UserResponseDTO>('/api/users/me')
		return response.data
	},
}
