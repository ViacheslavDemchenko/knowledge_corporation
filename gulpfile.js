var gulp = require('gulp'), //Подключаем Gulp
    less = require('gulp-less'), //Подключаем Less пакет
    browserSync = require('browser-sync'), //Подключаем Browser Sync
    concat = require('gulp-concat'), //Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), //Подключаем gulp-uglifyjs (для сжатия JS)
    minifyCss = require('gulp-clean-css'), //Подключаем пакет для минификации CSS
    rename = require('gulp-rename'), //Подключаем библиотеку для переименования файлов
    del = require('del'), //Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), //Подключаем библиотеку для работы с изображениями
    cache = require('gulp-cache'), //Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');//Подключаем библиотеку для автоматического добавления префикcов

/* DEVELOP СБОРКА */

gulp.task('less', function(){ //Создаем таск Less
    return gulp.src('src/less/main.less') //Берем источник
        .pipe(less()) //Преобразуем Less в CSS посредством gulp-less
        .pipe(autoprefixer(['last 3 versions', '> 0.1%'], { cascade: true })) //Создаем префиксы
        .pipe(concat('main.css')) //Объединяем все стили в одном CSS файле
        .pipe(gulp.dest('src/css')) //Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) //Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { //Создаем таск browser-sync
    browserSync.init({ //Выполняем browserSync
        server: { //Определяем параметры сервера
            baseDir: 'src' //Директория для сервера
        },
        notify: false //Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ //Берем все необходимые библиотеки
            'src/libs/js/**/*.js'
        ])
        .pipe(concat('libs.min.js')) //Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify({ //Сжимаем JS файл
            topLevel: true
        }))
        .pipe(gulp.dest('src/js')); //Выгружаем в папку src/js
});

gulp.task('watch', ['less', 'browser-sync', 'scripts'], function() {
    gulp.watch('src/less/*.less', ['less']); //Наблюдение за Less файлами в папке less
    gulp.watch('src/css/*.css'); //Наблюдение за Css файлами в папке css
    gulp.watch('src/*.html', browserSync.reload); //Наблюдение за HTML файлами в корне проекта
    gulp.watch('src/js/**/*.js', browserSync.reload); //Наблюдение за JS файлами в папке js
});

/* BUILD СБОРКА */

gulp.task('clean', function() {
    return del.sync('dist'); //Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*') //Берем все изображения из src
        .pipe(cache(imagemin({ //Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        })))
        .pipe(gulp.dest('dist/img')); //Выгружаем на продакшен
});

gulp.task('concat', function(){ //Объединяем все CSS файлы в один
    return gulp.src('src/css/*.css') //Берем источник
        .pipe(concat('style.css')) //Объединяем все стили в одном CSS файле
        .pipe(gulp.dest('src/css')) //Выгружаем результата в папку src/css     
});

gulp.task('minify', function(){ //Минифицируем единый полученный Css файл
    return gulp.src('src/css/style.css') //Берем источник
        .pipe(minifyCss({ //Минифицируем единый Css файл с сжатием 2-го уровня
                level: 2
            })) 
        .pipe(rename('stylemin.css')) //Переименовываем минифицированный Css файл
        .pipe(gulp.dest('src/css')) //Выгружаем результата в папку src/css     
});

gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {
 
    var buildCss = gulp.src('src/css/stylemin.css') //Переносим Css файлы в продакшен
    .pipe(gulp.dest('dist/css'))
 
    var buildFonts = gulp.src('src/fonts/**/*') //Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))
 
    var buildJs = gulp.src('src/js/**/*') //Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))
 
    var buildHtml = gulp.src('src/*.html') //Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

/* ОЧИСТКА КЭША */

gulp.task('clear', function () { //Очищаем кэш
    return cache.clearAll();
})

/* КОМАНДА ПО УМОЛЧАНИЮ */
 
gulp.task('default', ['watch']); //Запуск по умолчанию