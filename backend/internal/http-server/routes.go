package routes

import (
	"backend/internal/config"
	"backend/internal/http-server/handlers/websocket"
	"backend/internal/service"
	"github.com/go-chi/chi/v5"

	//"github.com/gorilla/websocket"
	httpSwagger "github.com/swaggo/http-swagger"
	"log/slog"
	"net/http"
)

type Handler struct {
	services *service.Service
	hub      *websocket.Hub
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{
		services: services,
		hub:      websocket.NewHub(),
	}
}

//func (h *Handler) InitRoutes() *gin.Engine {

// RegisterRoutes настраивает маршруты для приложения.
func (h *Handler) RegisterRoutes(router *chi.Mux, log *slog.Logger, cfg *config.Config) {
	go h.hub.Run()
	// Swagger
	router.Get("/swagger/*", httpSwagger.WrapHandler)

	// API routes
	router.Route("/api/", func(r chi.Router) {
		// Auth
		r.Route("/auth", func(r chi.Router) {
			r.Post("/sign-in", h.signIn(log, cfg))
			r.Post("/sign-up", h.signUp(log))
			r.Post("/refresh-tokens", h.refreshTokens(log, cfg))
			r.Post("/sign-out", h.signOut(log))
		})

		//r.Use(middleware.UserIdentity(log, cfg)) // Пример мидлвэра аутентификации
	})

	router.Route("/stream/", func(r chi.Router) {
		r.Route("/chat/", func(r chi.Router) {
			r.Post("/send-message", h.sendMessage(log, cfg))
			r.Get("/ws", func(w http.ResponseWriter, r *http.Request) {
				websocket.ServeWebSocket(h.hub, w, r, h.services)
			})
		})
	})

	router.Route("/user/", func(r chi.Router) {
		r.Post("/get-username-by-id", h.getUsernameById(log))
	})
}
