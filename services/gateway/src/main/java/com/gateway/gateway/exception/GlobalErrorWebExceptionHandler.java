package com.gateway.gateway.exception;

import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.cloud.gateway.support.NotFoundException;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
@Order(-2)
public class GlobalErrorWebExceptionHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        HttpStatusCode statusCode;
        String errorMessage;
        int statusValue;
        String reasonPhrase;
        
        if (ex instanceof NotFoundException) {
            statusCode = HttpStatus.NOT_FOUND;
            errorMessage = "The requested resource was not found";
        } else if (ex instanceof ResponseStatusException) {
            statusCode = ((ResponseStatusException) ex).getStatusCode();
            errorMessage = ex.getMessage();
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = "An unexpected error occurred. Please try again later.";
        }
        
        response.setStatusCode(statusCode);
        
        // Get status value and reason phrase
        statusValue = statusCode.value();
        reasonPhrase = statusCode instanceof HttpStatus 
                ? ((HttpStatus) statusCode).getReasonPhrase() 
                : HttpStatus.valueOf(statusValue).getReasonPhrase();
        
        String errorResponse = String.format(
                "{\"status\":%d,\"error\":\"%s\",\"message\":\"%s\"}",
                statusValue,
                reasonPhrase,
                errorMessage
        );
        
        DataBuffer buffer = response.bufferFactory()
                .wrap(errorResponse.getBytes(StandardCharsets.UTF_8));
        
        return response.writeWith(Mono.just(buffer));
    }
}