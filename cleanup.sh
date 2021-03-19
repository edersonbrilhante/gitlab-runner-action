#!/bin/bash

# Unregister Runner
docker run --rm -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner unregister \
    --name ${GITHUB_RUN_ID}
          