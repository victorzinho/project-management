#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ $# != 1 ]; then
  echo "usage: $0 <labels.json>"
	exit 1
elif [ ! -f "$1" ]; then
	echo "File '$1' does not exist!"
	exit 1
fi

function checkEnv {
	if [ -z "`printenv $1`" ]; then
    echo "Environment variable $1 must be set!"
		exit 2
  fi
}

checkEnv "GITHUB_OWNER"
checkEnv "GITHUB_REPO"
checkEnv "GITHUB_TOKEN"
checkEnv "WAFFLE_TOKEN"

${DIR}/gh-delete-labels.js
${DIR}/gh-create-labels.js $1
${DIR}/waffle-create.js
