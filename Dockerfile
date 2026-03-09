FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM golang:1.23-alpine AS backend-build
WORKDIR /app
COPY backend/ ./backend/
WORKDIR /app/backend
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=backend-build /app/server .
COPY --from=frontend-build /app/dist ./dist
EXPOSE 8080
CMD ["./server"]
