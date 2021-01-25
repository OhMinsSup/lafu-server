package main

import (
	"context"
	"lafu-server/api"
	"lafu-server/app"
	"lafu-server/lib"
	"os"
	"os/signal"
	"time"
)

func init() {
	app.NewEnv()
}

func main() {
	port := lib.GetEnvWithKey("PORT")
	server := app.New()

	// api server
	api.ApplyRoutes(server)

	// connecting WebSocket
	//server.GET("/ws", socket.ConnectWebSocket)

	// Start server
	go func() {
		if err := server.Start(":" + port); err != nil {
			server.Logger.Fatal(err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 10 seconds.
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	server.Logger.Info("shutting down the server")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		server.Logger.Fatal(err)
	}

	select {
	case <-ctx.Done():
		server.Logger.Info("timeout of 5 seconds.")
	}
	server.Logger.Info("Server exiting")
}
