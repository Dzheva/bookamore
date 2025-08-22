package com.bookamore.backend.config.openapi;

import com.bookamore.backend.annotation.No401Swgr;
import com.bookamore.backend.annotation.No404Swgr;
import com.bookamore.backend.annotation.No409Swgr;
import io.swagger.v3.oas.models.Operation;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;

@Configuration
public class OpenApiOperationCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        if (operation == null || operation.getResponses() == null) {
            return operation;
        }

        handeRemoveCodeAnnotations(operation, handlerMethod);

        return operation;
    }

    private void handleNo401SwgrAnnotation(Operation operation, HandlerMethod handlerMethod) {
        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(No401Swgr.class);
        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(No401Swgr.class);

        if (!isOnMethod && !isOnClass) {
            return;
        }

        operation.getResponses().remove(getCodeOf(HttpStatus.UNAUTHORIZED));
    }

    private void handleNo404SwgrAnnotation(Operation operation, HandlerMethod handlerMethod) {
        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(No404Swgr.class);
        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(No404Swgr.class);

        if (!isOnMethod && !isOnClass) {
            return;
        }

        operation.getResponses().remove(getCodeOf(HttpStatus.NOT_FOUND));
    }

    private void handleNo409SwgrAnnotation(Operation operation, HandlerMethod handlerMethod) {
        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(No409Swgr.class);
        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(No409Swgr.class);

        if (!isOnMethod && !isOnClass) {
            return;
        }

        operation.getResponses().remove(getCodeOf(HttpStatus.CONFLICT));
    }

    private String getCodeOf(HttpStatus status) {
        return String.valueOf(status.value());  // returns string http status value (e.g. "404", "409")
    }

    private void handeRemoveCodeAnnotations(Operation operation, HandlerMethod handlerMethod) {

        handleNo401SwgrAnnotation(operation, handlerMethod);

        handleNo404SwgrAnnotation(operation, handlerMethod);

        handleNo409SwgrAnnotation(operation, handlerMethod);
    }
}
