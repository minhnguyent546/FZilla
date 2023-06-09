const bookmarkElement = document.querySelector('.bookmark');

function getFavouriteMovies() {
    let userData = localStorage['user'];
    if (userData) { // login
        return (JSON.parse(userData)['favourite']);
    } else { // not
        if (typeof localStorage['favouriteMovies'] === 'undefined')
            localStorage.setItem('favouriteMovies', JSON.stringify([]));

        return JSON.parse(localStorage['favouriteMovies']);
    }
}

function setFavouriteMovies(movies) {
    let userData = localStorage['user'];
    if (userData) { // login
        let newData = JSON.parse(userData);
        newData['favourite'] = movies;
        localStorage.setItem('user', JSON.stringify(newData));
    } else { // not
        localStorage.setItem('favouriteMovies', JSON.stringify(movies));
    }
    updateBookmark();
}

// movie = { category: ..., filmId: ... };
// return -1 if not, else
function isFavouriteMovie(movie, listMovies = getFavouriteMovies()) {
    let position = -1;
    listMovies.forEach(function (value, index) {
        if (movie['category'] === value['category'] && movie['filmId'] === value['filmId'])
            position = index;
    });
    return position;
}

function addFavouriteMovie(movie, listMovies = getFavouriteMovies()) {
    // movie = { category: ..., filmId: ... };
    if (isFavouriteMovie(movie) !== -1)
        return;
    listMovies.push(movie);
    setFavouriteMovies(listMovies);
}

function removeFavouriteByIndex(index, listMovies = getFavouriteMovies()) {
    if (index < 0 || index >= listMovies.length) return;
    listMovies.splice(index, 1);
    setFavouriteMovies(listMovies);
}

function removeFavouriteByMovie(movie, listMovies = getFavouriteMovies()) {
    let position = isFavouriteMovie(movie);
    if (position === -1) return;
    removeFavouriteByIndex(position, listMovies);
}


if (bookmarkElement) {
    setDropdownType(document.querySelector('.dropdown__btn--bookmark').parentElement);
    
    const bookmarkWrapper = bookmarkElement.querySelector('.bookmark-wrapper');

    updateBookmark();

    function updateBookmark() {
        let favouriteMovies = getFavouriteMovies();

        if (favouriteMovies.length === 0) {
            bookmarkWrapper.innerHTML =
                `<div class="bookmark-wrapper--empty">
                    Không có phim nào ở đây!
                </div>`;
            if (bookmarkWrapper.nextElementSibling)
            bookmarkWrapper.nextElementSibling.remove();
        } else {
            renderBookmark(bookmarkWrapper, favouriteMovies);
        }
    }

    function renderBookmark(root, items) {
        root.innerHTML = '';
        items.forEach(function (value, key) {
            let movie = moviesByCategory[value['category']][value['filmId']];
            let item = document.createElement('div');
            item.classList.add('dropdown__list-item', 'bookmark-item');
            item.innerHTML =
                `<div class="bookmark-item-thumb">
                    <img class="bookmark-item-img" src="${movie.thumb}" alt="">
                </div>
                <div class="bookmark-item-desc">
                    <div class="bookmark-item-tittle">
                        ${movie.titleVn}
                    </div>
                    <div class="bookmark-item-subtitle">
                        ${movie.year}
                    </div>
                </div>
                <i class="bookmark-item-remove fa-solid fa-xmark"></i>`;
            item.querySelector('.bookmark-item-remove').addEventListener('click', function (e) {
                e.stopPropagation();
                removeFavouriteByIndex(key);
            });

            item.addEventListener('click', function () {
                window.location.href = `./film_info.html?film_category=${value['category']}&film_id=${value['filmId']}`;
            });

            root.append(item);
        });

        showClearAllButton();
    }

    function showClearAllButton() {
        if (bookmarkElement.querySelector('.bookmark-clear-all')) return;

        let clearAllButton = document.createElement('div');
        clearAllButton.classList.add('bookmark-clear-all');
        clearAllButton.textContent = 'Xóa tất cả';
        clearAllButton.addEventListener('click', function () {
            setFavouriteMovies([]);
            bookmarkElement.removeChild(bookmarkElement.querySelector('.bookmark-clear-all'));
        });
        bookmarkElement.append(clearAllButton);
    }
}

function handleBookmarkButton() {
    const { category, filmId } = getFilmInfoFromSearchParams();
    const mainFilmInfoBookmark = $('.main-film-info__bookmark');
    const smBSBreakpoint = 576;
    mainFilmInfoBookmark.addEventListener('click', function () {
        this.classList.add('shaking');
        this.addEventListener('animationend', () => {
            this.classList.remove('shaking');
        }, { once: true });
        if (
            this.classList.contains('main-film-info__bookmark--added') ||
            this.classList.contains('main-film-info__bookmark--adding')
        ) {
            // remove
            this.classList.remove('main-film-info__bookmark--added');
            this.classList.remove('main-film-info__bookmark--adding');
            removeFavouriteByMovie({ category, filmId });
            if (window.innerWidth >= smBSBreakpoint) {
                toast({
                    title: 'Thông báo',
                    message: 'Xóa phim thành công',
                    type: 'info',
                    duration: 3500
                }); 
            }

        }
        else {
            // add
            this.classList.add('main-film-info__bookmark--adding');
            addFavouriteMovie({ category, filmId });
            this.addEventListener('mouseout', function () {
                if (this.classList.contains('main-film-info__bookmark--adding')) {
                    this.classList.remove('main-film-info__bookmark--adding');
                    this.classList.add('main-film-info__bookmark--added');
                }
            }, { once: true });
            if (window.innerWidth >= smBSBreakpoint) {
                toast({
                    title: 'Thành công',
                    message: 'Thêm phim thành công',
                    type: 'success',
                    duration: 3500
                });   
            }
        }
    });
}

function setBookmarkButtonStatus() {
    const { category, filmId } = getFilmInfoFromSearchParams();
    const mainFilmInfoBookmark = $('.main-film-info__bookmark');

    if (isFavouriteMovie({ category, filmId } === -1)) {
        mainFilmInfoBookmark.classList.remove('main-film-info__bookmark--added');
        mainFilmInfoBookmark.classList.remove('main-film-info__bookmark--adding');
    }
    else {
        mainFilmInfoBookmark.classList.add('main-film-info__bookmark--added');
        mainFilmInfoBookmark.classList.add('main-film-info__bookmark--adding');
    }
}

