import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const NavigationContainer = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;

  @media screen and (max-width: 767px) {
    height: 60px;
    margin-bottom: 20px;
  }
`

export const LogoContainer = styled(Link)`
  height: 100%;
  width: 70px;
  padding: 0 0 0 10px;

  @media screen and (max-width: 767px) {
    padding: 0;
  }
`

export const NavLinks = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const NavLink = styled(Link)`
  padding: 10px 15px;
  cursor: pointer;

  @media screen and (max-width: 767px) {
    padding: 10px;
  }
`
