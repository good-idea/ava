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

test('Finds config in package.json', t => {
	changeDir('package-only');
	const conf = loadConfig();
	t.is(conf.failFast, true);
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
		defaults: {
			files: ['123', '!456']
		}
	};
	const {files, failFast} = loadConfig(opts);
	t.is(failFast, true, 'preserves original props');
	t.is(files, opts.defaults.files, 'merges in extra props');
	t.end();
});

test('Loads config from file', t => {
	changeDir('package-no-file-yes');
	const conf = loadConfig();
	t.is(conf.files, 'package-no-file-yes-test-value');
	t.end();
});

test('Loads config from file with `export default` syntax', t => {
	changeDir('package-no-file-yes-esm');
	const conf = loadConfig();
	t.is(conf.files, 'config-file-esm-test-value');
	t.end();
});

test('Loads config from factory function', t => {
	changeDir('package-no-file-yes-factory');
	const conf = loadConfig();
	t.ok(conf.files.startsWith(__dirname));
	t.end();
});

test('Throws an error if a config file returns a promise', t => {
	changeDir('package-no-file-yes-promise-bad');
	t.throws(loadConfig);
	t.end();
});

test('Receives a `projectDir` property', t => {
	changeDir('package-only');
	const conf = loadConfig();
	t.ok(conf.projectDir.startsWith(__dirname));
	t.end();
});
