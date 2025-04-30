// 初始化主题切换功能
function initializeThemeSwitcher() {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;

  if (!themeSwitch) return;

  // 检查本地存储中的主题偏好
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeSwitch.checked = true;
  }

  // 切换主题
  themeSwitch.addEventListener('change', () => {
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  });
}

// 从movieDB.json加载电影数据
let movies = [];
let moviesByYear = {};

async function loadMovies() {
  try {
    const response = await fetch('movieDB.json');
    movies = await response.json();
    // 按年份分组
    moviesByYear = movies.reduce((acc, movie) => {
      const year = movie.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(movie);
      return acc;
    }, {});
    initializeTimeline();
  } catch (error) {
    console.error('Error loading movie data:', error);
  }
}

// 生成时间线节点
function createTimelineYear(year, count) {
  const yearEl = document.createElement('div');
  yearEl.className = 'timeline-year';
  yearEl.innerHTML = `
    <h3>${year}</h3>
    <span class="year-count">${count}部电影</span>
  `;
  
  yearEl.addEventListener('click', () => {
    document.querySelectorAll('.timeline-year').forEach(el => 
      el.classList.remove('active'));
    yearEl.classList.add('active');
    renderMovies(moviesByYear[year]);
  });
  
  return yearEl;
}

// 生成电影卡片
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <div class="poster-container">
      <img src="${movie.poster}" class="poster" alt="${movie.title}" 
           onerror="this.onerror=null;this.src='images/hero-bg.png';this.alt='图片加载中...'">
      <div class="loading-placeholder">图片加载中...</div>
    </div>
    <div class="info">
      <h2 class="title">${movie.title}<span class="title-en">${movie.titleEn ? ` (${movie.titleEn})` : ''}</span></h2>
      <p class="director">导演：<a href="#" class="filter-link" data-type="director" data-value="${movie.director}">${movie.director}</a></p>
      <div class="cast">
        <span>主演：</span>
        <ul>${movie.actors?.map(actor => `<li><a href="#" class="filter-link" data-type="actor" data-value="${actor}">${actor}</a></li>`).join('') || ''}</ul>
      </div>
      <p class="year"><a href="#" class="filter-link" data-type="year" data-value="${movie.year}">${movie.year}</a></p>
    </div>
  `;
  return card;
}

// 渲染电影列表
function renderMovies(movies) {
  const container = document.querySelector('.movie-grid');
  container.innerHTML = '';
  movies.forEach(movie => {
    container.appendChild(createMovieCard(movie));
  });
}

// 初始化时间轴
function initializeTimeline() {
  const timelineList = document.querySelector('.timeline-list');
  const years = Object.keys(moviesByYear).sort((a, b) => b - a);
  
  // 生成时间轴
  years.forEach(year => {
    timelineList.appendChild(createTimelineYear(
      year, 
      moviesByYear[year].length
    ));
  });

  // 移动端初始化滚动到最新年份
  if (window.matchMedia("(max-width: 768px)").matches) {
    timelineList.scrollTo({
      left: 0,
      behavior: 'auto'
    });
  }

  // 默认选中最新年份
  const firstYearElement = document.querySelector('.timeline-year');
  if (firstYearElement) {
    firstYearElement.classList.add('active');
    renderMovies(moviesByYear[years[0]]);
  }
}

// 按导演分组
function groupMoviesByDirector(movies) {
  return movies.reduce((acc, movie) => {
    if (!acc[movie.director]) {
      acc[movie.director] = [];
    }
    acc[movie.director].push(movie);
    return acc;
  }, {});
}

// 按演员分组
function groupMoviesByActor(movies) {
  const actorMap = {};
  movies.forEach(movie => {
    movie.actors?.forEach(actor => {
      if (!actorMap[actor]) {
        actorMap[actor] = [];
      }
      actorMap[actor].push(movie);
    });
  });
  return actorMap;
}

// 初始化视图切换
function initializeViewSwitcher() {
  const viewButtons = document.querySelectorAll('.view-button');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按钮的active状态
      viewButtons.forEach(btn => btn.classList.remove('active'));
      // 设置当前按钮为active
      button.classList.add('active');
      // 根据选择的视图重新渲染
      const view = button.dataset.view;
      switchView(view);
    });
  });
}

// 切换视图
function switchView(view) {
  if (view === 'year') {
    renderGroupedView(moviesByYear, '年份');
    // initializeTimeline();
  } else if (view === 'director') {
    const moviesByDirector = groupMoviesByDirector(movies);
    renderGroupedView(moviesByDirector, '导演');
  } else if (view === 'actor') {
    const moviesByActor = groupMoviesByActor(movies);
    renderGroupedView(moviesByActor, '演员');
  }
}

// 渲染分组视图
function renderGroupedView(groupedMovies, type) {
  const timelineList = document.querySelector('.timeline-list');
  timelineList.innerHTML = '';

  Object.keys(groupedMovies).sort().forEach(key => {
    const groupEl = document.createElement('div');
    groupEl.className = 'timeline-year';
    groupEl.innerHTML = `
      <h3>${key}</h3>
      <span class="year-count">${groupedMovies[key].length}部电影</span>
    `;
    
    groupEl.addEventListener('click', () => {
      document.querySelectorAll('.timeline-year').forEach(el => 
        el.classList.remove('active'));
      groupEl.classList.add('active');
      renderMovies(groupedMovies[key]);
    });
    
    timelineList.appendChild(groupEl);
  });

  // 默认选中第一个
  const firstGroup = document.querySelector('.timeline-year');
  if (firstGroup) {
    firstGroup.classList.add('active');
    renderMovies(groupedMovies[Object.keys(groupedMovies)[0]]);
  }
}

// 处理过滤链接点击
function handleFilterLinkClick(e) {
  e.preventDefault();
  const link = e.target;
  const type = link.dataset.type;
  const value = link.dataset.value;

  // 找到对应的视图按钮并激活
  const viewButtons = document.querySelectorAll('.view-button');
  viewButtons.forEach(btn => btn.classList.remove('active'));
  
  const viewButton = document.querySelector(`.view-button[data-view="${type}"]`);
  if (viewButton) {
    viewButton.classList.add('active');
    viewButton.click();
  }

  // 找到对应的分类项并点击
  setTimeout(() => {
    const categoryItem = Array.from(document.querySelectorAll('.timeline-year h3'))
      .find(h3 => h3.textContent === value)?.parentElement;
    if (categoryItem) {
      categoryItem.click();
    }
  }, 100);
}

// 初始化加载
document.addEventListener('DOMContentLoaded', () => {
  initializeThemeSwitcher();
  initializeViewSwitcher();
  loadMovies();

  // 为所有过滤链接添加点击事件
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-link')) {
      handleFilterLinkClick(e);
    }
  });
});
