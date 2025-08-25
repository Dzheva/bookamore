package com.bookamore.backend.config.openapi;

import com.bookamore.backend.annotation.No401Swgr;
import com.bookamore.backend.annotation.No404Swgr;
import com.bookamore.backend.annotation.No409Swgr;
import io.swagger.v3.oas.models.Operation;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;

import java.lang.annotation.Annotation;

@Configuration
public class OpenApiOperationCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        if (operation == null || operation.getResponses() == null) {
            return operation;
        }

        handleRemoveCodeAnnotations(operation, handlerMethod);

        return operation;
    }

//    private void handleNo401SwgrAnnotation(Operation operation, HandlerMethod handlerMethod) {
//        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(No401Swgr.class);
//        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(No401Swgr.class);
//
//        if (!isOnMethod && !isOnClass) {
//            return;
//        }
//
//        operation.getResponses().remove(getCodeOf(HttpStatus.UNAUTHORIZED));
//    }
//
//    private void handleNo404SwgrAnnotation(Operation operation, HandlerMethod handlerMethod) {
//        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(No404Swgr.class);
//        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(No404Swgr.class);
//
//        if (!isOnMethod && !isOnClass) {
//            return;
//        }
//
//        operation.getResponses().remove(getCodeOf(HttpStatus.NOT_FOUND));
//    }
//
//    private void handleNo409SwgrAnnotation(Operation operation, HandlerMethod handlerMethod) {
//        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(No409Swgr.class);
//        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(No409Swgr.class);
//
//        if (!isOnMethod && !isOnClass) {
//            return;
//        }
//
//        operation.getResponses().remove(getCodeOf(HttpStatus.CONFLICT));
//    }
//
//    private String getCodeOf(HttpStatus status) {
//        return String.valueOf(status.value());  // returns string http status value (e.g. "404", "409")
//    }
//
//    private void handleRemoveCodeAnnotations(Operation operation, HandlerMethod handlerMethod) {
//
//        handleNo401SwgrAnnotation(operation, handlerMethod);
//
//        handleNo404SwgrAnnotation(operation, handlerMethod);
//
//        handleNo409SwgrAnnotation(operation, handlerMethod);
//    }

    private void removeByAnnotation(Operation operation, HandlerMethod handlerMethod,
                                    Class<? extends Annotation> annotationClass,
                                    HttpStatus httpStatus) {
        boolean isOnMethod = handlerMethod.getMethod().isAnnotationPresent(annotationClass);
        boolean isOnClass = handlerMethod.getBeanType().isAnnotationPresent(annotationClass);

        if (isOnMethod || isOnClass) {
            String code = String.valueOf(httpStatus.value());
            operation.getResponses().remove(code);
        }
    }

    private void handleRemoveCodeAnnotations(Operation operation, HandlerMethod handlerMethod) {
        removeByAnnotation(operation, handlerMethod, No401Swgr.class, HttpStatus.UNAUTHORIZED);
        removeByAnnotation(operation, handlerMethod, No404Swgr.class, HttpStatus.NOT_FOUND);
        removeByAnnotation(operation, handlerMethod, No409Swgr.class, HttpStatus.CONFLICT);
    }
}
