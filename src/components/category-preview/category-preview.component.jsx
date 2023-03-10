import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../product-card/product-card.component'
import {
  CategoryPreviewContainer,
  Preview,
  Title,
} from './category-preview.styles.jsx'

const CategoryPreview = ({ title, products }) => {
  const navigate = useNavigate()

  return (
    <CategoryPreviewContainer>
      {/* <h2> */}
        <Title className='title' to={title}>
          {title}
        </Title>
      {/* </h2> */}
      <Preview>
        {/* Show only the first four items */}
        {products
          .filter((_, idx) => idx < 4)
          .map(product => (
            <ProductCard
              onClick={() => navigate(`${title}/${product.name}`)}
              key={product.id}
              product={product}
            />
          ))}
      </Preview>
    </CategoryPreviewContainer>
  )
}

export default CategoryPreview
