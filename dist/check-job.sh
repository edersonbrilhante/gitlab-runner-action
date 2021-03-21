#!/bin/bash

sed '/Job succeeded\|Failed to process runner/q' <( docker logs gitlab-runner -f 2>&1)
          