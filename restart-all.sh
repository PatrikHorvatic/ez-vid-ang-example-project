#!/bin/bash
set -e

rm -rf .angular node_modules
npm i
npx ng serve