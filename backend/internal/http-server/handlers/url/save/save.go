package save

import (
	resp "backend/internal/lib/api/response"
)

type Request struct {
	URL   string `json:"url" validate:"required,url"`
	Alias string `json:"alias,omitempty"`
}

type Response struct {
	resp.Response
	Alias string `json:"alias,omitempty"`
}

// EXAMPLE
//// TODO: move to config
//const aliasLength = 4
//
////go:generate go run github.com/vektra/mockery/v2@v2.50.1 --name URLSaver
//type URLSaver interface {
//	SaveURL(urlToSave string, alias string) (int64, error)
//}
//
//func New(log *slog.Logger, urlSaver URLSaver) http.HandlerFunc {
//	return func(w http.ResponseWriter, r *http.Request) {
//		const op = "handlers.url.save.New"
//
//		log = log.With(
//			slog.String("op", op),
//			slog.String("request_id", middleware.GetReqID(r.Context())),
//		)
//
//		var req Request
//
//		err := render.DecodeJSON(r.Body, &req)
//		if err != nil {
//			log.Error("failed to decode request", slog.String("error", err.Error()))
//
//			render.JSON(w, r, resp.Error("failed to decode request"))
//
//			return
//		}
//
//		log.Info("request body decoded", slog.Any("request", req))
//
//		if err := validator.New().Struct(req); err != nil {
//			var validateErr validator.ValidationErrors
//			errors.As(err, &validateErr)
//
//			log.Error("invalid request", slog.String("error", err.Error()))
//
//			render.JSON(w, r, resp.ValidationErrors(validateErr))
//
//			return
//		}
//
//		alias := req.Alias
//		if alias == "" {
//			alias = random.NewRandomString(aliasLength)
//		}
//
//		id, err := urlSaver.SaveURL(req.URL, alias)
//		if errors.Is(err, storage.ErrUrlExists) {
//			log.Info("url already exists", slog.String("url", req.URL))
//
//			render.JSON(w, r, resp.Error("url already exists"))
//
//			return
//		}
//		if err != nil {
//			log.Error("failed to save url", slog.String("error", err.Error()))
//
//			render.JSON(w, r, resp.Error("failed to save url"))
//
//			return
//		}
//
//		log.Info("url saved", slog.Int64("id", id))
//
//		render.JSON(w, r, Response{
//			Response: resp.OK(),
//			Alias:    alias,
//		})
//	}
//}
