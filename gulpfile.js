var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	browserify = require('gulp-browserify');

var src = {
		scripts: 'app/app.js',
	}

gulp.task('scripts', function() {
	return gulp.src(src.scripts)
		.pipe(
			browserify({
				paths: [
					'bower_components',
					'app'
				]
			})
		)
		.pipe(babel({
			'presets': ['es2015'],
			'compact': false
		}))
		//.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./public/js'));
});

function defaultTask() {
	gulp.start(
		'scripts'
	);
}

gulp.task('watch', function() {
	defaultTask();
	gulp.watch('app/**/*', ['scripts']);
});

gulp.task('default', function() {
	defaultTask();
});