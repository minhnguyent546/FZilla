/* ************************************* *
 * Tạm thời hoàn tất                     *
 * Chỉ cần bổ sung thông báo đăng xuất   *
 * Thêm tính năng đăng nhập              *
 * ************************************* */

const viInformationTitle = {
    username: 'Tên đăng nhập',
    fullname: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    registrationDate: 'Ngày đăng kí'
};


function getUserData() {
    return typeof localStorage['user'] === 'undefined' ? undefined : JSON.parse(localStorage['user']);
}

function setUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function isValidPassword(values) {
    let userData = getUserData();

    if (userData['password'] === values['password_old']) {
        userData['password'] = values['password'];
        return true;
    } else {
        return false;
    }
}

// Logout

document.querySelector('.user-logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    renderUserHeader();


    if (window.location.pathname !== '/FZilla/index.html')
        window.location.href = '/FZilla/index.html';

    /************************************
     *  Hiển thị thông báo đăng xuất    *
     * **********************************/
});

// Header

function renderUserHeader() {
    const userData = getUserData();

    if (typeof userData !== 'undefined') {

        // Change state
        document.querySelector('.header__user').classList.remove('header__user--logged-out');
        document.querySelector('.header__user').classList.add('header__user--logged-in');

        // Show user
        let usernameElement = document.querySelector('.nav-link--username');
        
        // usernameElement.innerHTML =
        //     `${userData['username']} <span class="px-2"><i
        // class="fa fa-user" aria-hidden="true"></i></span>`;

        usernameElement.innerHTML =
            `${userData['username']} <span class="px-2"><img class="header__user-img" src="${userData.avatar}"></img></span>`;
    } else {
         // Change state
         document.querySelector('.header__user').classList.add('header__user--logged-out');
         document.querySelector('.header__user').classList.remove('header__user--logged-in');
 
    }
}


// User profile 

function renderUserProfile() {
    const userInformationElement = document.querySelector('.user-information');
    if (userInformationElement) {
        let userData = getUserData();

        const usernameElement = userInformationElement.querySelector('.user-information__username');
        const fullnameElement = userInformationElement.querySelector('.user-information__fullname');
        const emailElement = userInformationElement.querySelector('.user-information__email');
        const phoneElement = userInformationElement.querySelector('.user-information__phone');
        const registrationDateElement = userInformationElement.querySelector('.user-information__registration-date');
        const avatarElement = userInformationElement.querySelector('.user-avatar');
        const editProfileButton = userInformationElement.querySelector('.user-information__edit-profile');

        function renderInformation(element, information, title) {
            element.innerHTML =
                `<div class="user-information-title">${title}</div>
            <input type="text" class="user-information-content" disabled value="${information}"></input>`;
        };

        function renderUserAvatar(element, avatar) {
            element.innerHTML =
            `<img class="user-avatar__img" src="${avatar}" alt="">`;
        }

        function renderProfileMovies(root, movies, colClassList = ['col-2']) {
            if (!root) return;

            root.innerHTML = movies.map((value) => {
                let movie = moviesByCategory[value['category']][value['filmId']];
                let category = value['category'];
                let id = value['filmId'];
                return `
                <div class="${colClassList.join(' ')}">
                <div class="film-item">
                <a href="/FZilla/film_info.html?film_category=${category}&film_id=${id}" class="film-item-inner">
                <div class="film-item__main">
                <div class="film-item__thumb">
                <img src="${movie.thumb}" alt="${movie.titleEn}" class="film-item__thumb-img">
                </div>
                
                <div class="film-item__label">
                <div class="film-item__label-item">HD</div>
                <div class="film-item__label-item">Thuyết minh</div>
                </div>
                
                <div class="film-item__rating ${movie.rating ? '' : 'film-item__rating--not-available'}">
                <span class="film-item__rating-icon"><i class="fa-regular fa-star"></i></span>
                <span class="film-item__rating-num">${movie.rating}</span>
                <span class="film-item__rating-NA">N/A</span>
                </div>
                
                <div class="film-item__play-btn" title="Xem phim">
                <span class="film-item__play-btn-icon"><i class="fa-solid fa-play"></i></span>
                </div>
                </div>
                <div class="film-item__desc">
                <div class="film-item__title" title="${movie.titleVn}">${movie.titleVn}</div>
                <div class="film-item__subtitle">
                <span class="film-item__subtitle-item" title="${movie.titleEn} (${movie.year})">${movie.titleEn} (${movie.year})</span>
                </div>
                    </div>
                    </a>
                    </div>
                    </div>
                    `;
            }).join('');
        }

        editProfileButton.addEventListener('click', function () {
            alert('Chức năng đang cập nhật! Vui lòng quay lại sau!');
        });

        renderInformation(usernameElement, userData['username'], viInformationTitle['username']);
        renderInformation(fullnameElement, userData['fullname'], viInformationTitle['fullname']);
        renderInformation(emailElement, userData['email'], viInformationTitle['email']);
        renderInformation(phoneElement, userData['phone'], viInformationTitle['phone']);
        renderInformation(registrationDateElement, userData['registrationDate'], viInformationTitle['registrationDate']);
        renderUserAvatar(avatarElement, userData['avatar']);
        renderProfileMovies(document.querySelector('.user-bookmark .row'), userData['favourite']);
        renderProfileMovies(document.querySelector('.user-watch-history .row'), userData['history']);
    }
}

renderUserHeader();
renderUserProfile();