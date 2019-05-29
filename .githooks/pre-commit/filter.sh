#!/bin/sh


EMAIL=$(git config user.email)

if [[ ${EMAIL} == *"xmind"* ]]; then
  echo "Do not use *@xmind.net email to commit codes.";
  exit 1;
else
  exit 0
fi
