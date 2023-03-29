package main

import (
	"context"
	"fmt"
	"os"

	"github.com/Hacknock/leadyou/drivers"
)

func main() {
	ctx := context.Background()
	leadyouDriver, err := drivers.InitializeLeadyouDriver(ctx)
	if err != nil {
		fmt.Printf("🚨Driverの初期化に失敗しました: %s\n", err)
		os.Exit(2)
	}

	leadyouDriver.ServePages(ctx, ":3000")
}
