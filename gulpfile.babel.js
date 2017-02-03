import gulp from 'gulp';
import { spawn } from 'child_process';
import sequence from 'run-sequence';
import copy from 'gulp-copy';
import del from 'del';

import eslint from 'gulp-eslint';
import pug from 'gulp-pug';
import et from 'element-theme';
import less from 'gulp-less';
import babel from 'gulp-babel';
import NWB from 'nwjs-builder';

//
//
// Init build folder

gulp.task('clean', () => {
    return del(['build', 'dist']);
});

gulp.task('copy-assets', cb => {
    return gulp.src([
        'src/assets/**/*',
        'package.json'
    ])
    .pipe(copy('build/', { prefix: 1 })).on('close', cb);
});

gulp.task('build-theme', cb => {
    return et.run({
        config: 'src/vue-ui/element-variables.css',
        out: 'build/theme',
        minimize: false
    }, cb);
});


//
//
// Build dist folder

gulp.task('eslint', cb => {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('close', cb);
});

// TODO: use gulp-webpack
gulp.task('ui-js', cb => {
    return spawn('npm', ['run', 'webpack'], {
        stdio: [0, process.stdout, process.stderr]
    }).on('close', cb);
});

gulp.task('ui-html', cb => {
    return gulp.src('src/vue-ui/index.pug').pipe(pug())
        .pipe(gulp.dest('build/')).on('close', cb);
});

gulp.task('ui-css', cb => {
    return gulp.src('src/vue-ui/element-ui.less').pipe(less())
        .pipe(gulp.dest('build/')).on('close', cb);
});

gulp.task('server-js', cb => {
    return gulp.src(['src/feathers-server/*.js', 'src/feathers-server/**/*.js'])
        .pipe(babel({
            presets: [
                'es2015', 'stage-0'
            ],
            plugins: [
                'transform-class-properties',
                'transform-runtime'
            ],
            sourceMap: 'both'
        })).pipe(gulp.dest('build/')).on('close', cb);
});


//
//
// Build the apps

const nwjsOpts = {
    version: '0.19.4',
    outputDir: 'dist/',
    executableName: 'DataDeck',
    withFFmpeg: false,
    sideBySide: true,
    macIcns: 'build/assets/dd.icns',
    production: true
};

const nwjsOptsDebug = Object.assign({
    run: true
}, nwjsOpts);
nwjsOptsDebug.version = `${nwjsOpts.version}-sdk`;
nwjsOptsDebug.production = false;

gulp.task('release-osx', cb => {
    NWB.commands.nwbuild('build', Object.assign({
        platforms: 'osx64'
    }, nwjsOpts), cb);
});

gulp.task('release-linux', cb => {
    NWB.commands.nwbuild('build', Object.assign({
        platforms: 'linux64'
    }, nwjsOpts), cb);
});

gulp.task('debug-osx', cb => {
    NWB.commands.nwbuild(['--remote-debugging-port=9222', 'build/'], Object.assign({
        platforms: 'osx64'
    }, nwjsOptsDebug), cb);
});

gulp.task('debug-linux', cb => {
    NWB.commands.nwbuild(['--remote-debugging-port=9222', 'build/'], Object.assign({
        platforms: 'linux64'
    }, nwjsOptsDebug), cb);
});


//
//
// Combined tasks

gulp.task('build', cb => {
    return sequence('eslint', ['copy-assets', 'build-theme'], ['server-js', 'ui-js'], ['ui-css', 'ui-html'], cb);
});

gulp.task('default', ['build']);