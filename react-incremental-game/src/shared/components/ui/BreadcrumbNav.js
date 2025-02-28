import React from 'react';
import { Link } from 'react-router-dom';
import './BreadcrumbNav.css';

const BreadcrumbNav = ({ paths }) => {
    return (
        <nav className="breadcrumb-nav">
            <ul>
                {paths.map((path, index) => (
                    <li key={index}>
                        <Link to={path.link}>{path.name}</Link>
                        {index < paths.length - 1 && <span> &gt; </span>}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BreadcrumbNav;