import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HealineComponent from './pages/HeadLine/index.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AreaManagerComponent from './pages/AreaManager/index.tsx';
import CategoryManagerComponent from './pages/CategoryManager/index.tsx';
import PersonInfoComponent from './pages/PersonInfo/index.tsx';
import ShopManagerComponent from './pages/ShopManager/index.tsx';
import styles from './index.module.scss';


// 假设我们有几个要跳转的页面组件
const Home = () => <div className={styles.welcome}> 欢迎来到Travel Life 管理员系统</div>;
const HealinePage = () => <div>{ HealineComponent()}</div>;
const AreaManagerPage = () => <div>{AreaManagerComponent()}</div>;
const CategoryManagerPage = () => <div>{CategoryManagerComponent()}</div>
const PersonInfoPage = () => <div>{ PersonInfoComponent()}</div>
const ShopManagerPage = () => <div>{ ShopManagerComponent()}</div>;

function App() {
  return (
    <Router>
      <div className={styles.container}>
      <ToastContainer />
        {/* 侧边栏，始终显示 */}
        <div className={styles.leftContainer}>
          <h2>导航菜单</h2>
          <ul className={styles.leftListContainer}>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/headline">头条管理</Link></li>
            <li><Link to="/category">类别管理</Link></li>
            <li><Link to="/area">区域管理</Link></li>
            <li><Link to="/person">账号管理</Link></li>
            <li><Link to="/page3">店铺管理</Link></li>
          </ul>
        </div>

        {/* 主内容区，内容会根据路由切换 */}
        <div className={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/headline" element={<HealinePage />} />
            <Route path="/area" element={<AreaManagerPage />} />
            <Route path="/category" element={<CategoryManagerPage />} />
            <Route path="/person" element={<PersonInfoPage />} />
            <Route path="/page3" element={<ShopManagerPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
