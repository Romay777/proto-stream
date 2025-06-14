package login

import (
	"backend/internal/lib/api/response"
	"time"

	"backend/internal/config"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt/v4"
	"log/slog"
	"net/http"
)

type Request struct {
	Username string `json:"username,omitempty"`
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

// Response @Schema определение типа Response
type Response struct {
	Status string `json:"status"`
	Error  string `json:"error,omitempty"`
}

// MergedResponse структура ответа для логина
// @Description Ответ после успешного логина
type MergedResponse struct {
	Response     response.Response `json:"response"`
	AccessToken  string            `json:"access_token,omitempty"`
	RefreshToken string            `json:"refresh_token,omitempty"`
}

var secretKey = []byte("my_secret_key")

// New создает обработчик для входа
// @Summary Login
// @Description Authenticates user and returns a JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body Request true "Login request"
// @Success 200 {object} login.MergedResponse
// @Failure 400 {object} map[string]string
// @Router /api/auth/login [post]
func New(log *slog.Logger, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.url.save.New"

		log = log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		var req Request

		// Декодируем JSON тело запроса
		if err := render.DecodeJSON(r.Body, &req); err != nil {
			log.Error("failed to decode request", slog.String("error", err.Error()))
			render.JSON(w, r, response.Error("failed to decode request"))
			return
		}

		log.Info("request body decoded", slog.Any("request", req))

		username := req.Username
		email := req.Email
		password := req.Password

		// Простая проверка на пустые значения
		if (username == "" && email == "") || password == "" {
			log.Error("invalid request: username or password is empty")
			render.JSON(w, r, response.Error("username and password are required"))
			return
		}

		// Заглушка: проверить учетные данные
		//if username != "testuser" || password != "testpassword" {
		//	log.Error("invalid credentials", slog.String("username", username))
		//	render.JSON(w, r, resp.Error("invalid username or password"))
		//	return
		//}

		// Генерация JWT токена
		accessToken, refreshToken, err := generateJWT(username, cfg)
		if err != nil {
			log.Error("failed to generate token", slog.String("error", err.Error()))
			render.JSON(w, r, response.Error("failed to generate token"))
			return
		}

		render.JSON(w, r, MergedResponse{
			Response:     response.OK(),
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		})
	}
}

// generateJWT генерирует JWT токен
func generateJWT(username string, cfg *config.Config) (string, string, error) {
	claimsAccess := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(cfg.Auth.AccessTokenTTL).Unix(), // Время истечения токена
		"iat":      time.Now().Unix(),
	}

	claimsRefresh := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(cfg.Auth.RefreshTokenTTL).Unix(), // Время истечения токена
		"iat":      time.Now().Unix(),
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsAccess)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsRefresh)

	accessTokenString, err := accessToken.SignedString(secretKey)
	if err != nil {
		return "", "", err
	}

	refreshTokenString, err := refreshToken.SignedString(secretKey)
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}
