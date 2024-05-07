import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TableComponent from './pages/HeadLine/index.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// 假设我们有几个要跳转的页面组件
const Home = () => <div>首页内容</div>;
const Page1 = () => <div>{ TableComponent()}</div>;
const Page2 = () => <div>页面2内容</div>;
const Page3 = () => <div>页面3内容</div>;

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
      <ToastContainer />
        {/* 侧边栏，始终显示 */}
        <div style={{ padding: '10px', width: '15%',height:'100%', background: '#f0f0f0' }}>
          <h2>导航菜单</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/page1">头条管理</Link></li>
            <li><Link to="/page2">类别管理</Link></li>
            <li><Link to="/page3">区域管理</Link></li>
            <li><Link to="/page3">账号管理</Link></li>
            <li><Link to="/page3">商铺管理</Link></li>
          </ul>
        </div>

        {/* 主内容区，内容会根据路由切换 */}
        <div style={{ width: '85%', padding: '10px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
