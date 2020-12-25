#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ShortenStack } from '../lib/shorten-stack';

const app = new cdk.App();
new ShortenStack(app, 'ShortenStack');
