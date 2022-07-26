module Hacknock/leadyou

go 1.18

replace Hacknock/logger => ./packages/appTier/logger

replace Hacknock/monitor => ./packages/dataTier/monitor

replace Hacknock/recorder => ./packages/dataTier/recorder

replace Hacknock/database => ./packages/dataTier/database

replace Hacknock/structure => ./packages/structure

replace Hacknock/github => ./packages/dataTier/github

replace Hacknock/repository => ./packages/appTier/repository

require github.com/go-chi/chi/v5 v5.0.7
