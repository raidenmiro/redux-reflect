#!/bin/bash

if commitlint --edit --verbose; then
  exit 1
fi