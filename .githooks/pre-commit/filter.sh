#!/bin/sh


EMAIL=$(git config user.email)

npm run lint

if [[ $? != 0 ]]; then
  echo "lint error."
  exit 1;
fi

if [[ ${EMAIL} == *"xmind"* ]]; then
  echo "Do not use *@xmind.net email to commit codes.";
  exit 1;
else
  exit 0
fi
