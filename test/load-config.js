'use strict';
const path = require('path');
const tap = require('tap');
const loadConfig = require('../lib/load-config');

const {test} = tap;

tap.afterEach(done => {
	process.chdir(path.resolve(__dirname, '..'));
	done();
});

const changeDir = fixtureDir => {
	process.chdir(path.resolve(__dirname, 'fixture', 'load-config', fixtureDir));
};

test('Finds package.json', t => {
	changeDir('package-only');
	const conf = loadConfig();
	t.is(conf.failFast, true);
	t.end();
});

test('Loads sibling `ava.config.js` file if no package config is present', t => {
	changeDir('package-no-file-yes');
	const conf = loadConfig();
	t.is(conf.files, 'package-no-file-yes-test-value');
	t.end();
});

test('Throws a warning of both configs are present', t => {
	changeDir('package-yes-file-yes');
	t.throws(loadConfig);
	t.end();
});

test('Merges in defaults passed with initial call', t => {
	changeDir('package-only');
	const opts = {
		files: ['123', '!456'],
		concurrency: 5
	};
	const {files, failFast, concurrency} = loadConfig(opts);
	t.is(failFast, true, 'preserves original props');
	t.is(files, opts.files, 'merges in extra props');
	t.is(concurrency, opts.concurrency, 'overrides original props');
	t.end();
});

// Test('Passes `process` to config file for factory functions', t => {
// })

// test('Returns project dir for package.json')
