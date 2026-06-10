#!/bin/bash
if ! ss -tlnp | grep -q ':3000'; then
  cd /home/z/my-project/.next/standalone
  PORT=3000 HOSTNAME=127.0.0.1 bun server.js &
fi
