package org.ru.dictionary.service.impl;

import lombok.RequiredArgsConstructor;
import org.ru.dictionary.dto.user.UserRequestDTO;
import org.ru.dictionary.dto.user.UserResponseDTO;
import org.ru.dictionary.entity.User;
import org.ru.dictionary.enums.Authorities;
import org.ru.dictionary.enums.BusinessErrorCodes;
import org.ru.dictionary.exception.ApiException;
import org.ru.dictionary.mapper.UserMapper;
import org.ru.dictionary.repository.UserRepository;
import org.ru.dictionary.service.ActivationService;
import org.ru.dictionary.service.S3Service;
import org.ru.dictionary.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final ActivationService activationService;
    private final S3Service s3Service;

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO request) {
        userRepository.findByUsername(request.getUsername())
                .ifPresent(user -> {
                    throw new ApiException(
                            BusinessErrorCodes.USER_EXISTS,
                            "Username '" + request.getUsername() + "' already exists"
                    );
                });

        User user = new User();
        user.setUsername(request.getUsername());
        user.getRoles().add(Authorities.ROLE_USER);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Optional.ofNullable(request.getImageFile()).ifPresent(image -> user.setImagePath(s3Service.uploadFile(request.getImageFile())));
        activationService.sendActivationEmail(user);

        return userMapper.toResponseDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        BusinessErrorCodes.USER_NOT_FOUND,
                        "User ID: " + id
                ));

        Optional.ofNullable(dto.getUsername()).ifPresent(user::setUsername);
        Optional.ofNullable(dto.getPassword())
                .ifPresent(pass -> user.setPassword(passwordEncoder.encode(pass)));
        Optional.ofNullable(dto.getImageFile()).ifPresent(image -> user.setImagePath(s3Service.uploadFile(dto.getImageFile())));

        return userMapper.toResponseDTO(userRepository.save(user));
    }


    private Set<Authorities> getRolesFromNames(Set<String> roleNames) {
        return roleNames.stream()
                .map(name -> {
                    try {
                        return Authorities.valueOf(name);
                    } catch (IllegalArgumentException ex) {
                        throw new ApiException(
                                BusinessErrorCodes.INVALID_ROLE,
                                "Invalid role name: " + name
                        );
                    }
                })
                .collect(Collectors.toSet());
    }

    @Override
    public UserResponseDTO getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(
                        BusinessErrorCodes.USER_NOT_FOUND,
                        "Username: " + username
                ));

        return userMapper.toResponseDTO(user);
    }
}