#!/usr/bin/env sh
cd packages
vue create --inlinePreset '{"plugins":{"@vue/cli-plugin-babel":{}}}' --force --git false dev
cd dev
vue add @vueneue/ssr
