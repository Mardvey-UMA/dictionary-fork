package org.ru.dictionary.security;


import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record Token(UUID id, String subject, List<String> authorities, Instant createdAt,
                    Instant expiresAt) {
}
