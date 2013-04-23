#!/bin/bash

git ls-tree -r master --name-only | grep -r \.js$ | xargs uglifyjs -lint > /dev/null

