#!/bin/bash

git ls-files | grep -r \.js$ | xargs uglifyjs -lint > /dev/null

