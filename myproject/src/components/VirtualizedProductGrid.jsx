import React, { memo, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ProductCardModern from './ProductCardModern';
const VirtualizedProductGrid = memo(({ 
  products, 
  containerWidth, 
  containerHeight,
  onProductHover,
  onProductLeave,
  getCurrentImage,
  handleImgError 
}) => {
  // Calculate grid dimensions
;
const itemWidth = 300; // Base width for each product card
const itemHeight = 450; // Base height for each product card
const gap = 16; // Gap between items (reduced from 24 to 16)
const columnsCount = useMemo(() => {
    return Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
  }, [containerWidth]);
const rowsCount = useMemo(() => {
    return Math.ceil(products.length / columnsCount);
  }, [products.length, columnsCount]);

  // Cell renderer for react-window
const Cell = memo(({ columnIndex, rowIndex, style }) => {
    ;
const productIndex = rowIndex * columnsCount + columnIndex;
const product = products[productIndex];
if (!product) return null;
  return (
    <div 
        style={{
          ...style,
          padding: gap / 2,
          left: style.left + gap / 2,
          top: style.top + gap / 2,
          width: style.width - gap,
          height: style.height - gap,
        }}
      >
        <div 
          className="group transform transition-all duration-500 hover:-translate-y-2 h-full"
          onMouseEnter={() => onProductHover?.(product._id || product.id)}
          onMouseLeave={() => onProductLeave?.()}
        >
          <div 
            className="product-card rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border overflow-hidden h-full flex flex-col"
            style={{ 
              backgroundColor: '#FEFCF3',
              borderColor: '#F8F9FA'
            }}
          >
            <ProductCardModern 
              product={product} 
              getCurrentImage={getCurrentImage}
              handleImgError={handleImgError}
            />
          </div>
        </div>
      </div>
    );
    }
  );

  Cell.displayName = 'VirtualizedCell';
if (products.length === 0) {
    return (
    <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }
  return (
    <Grid
      columnCount={columnsCount}
      columnWidth={itemWidth + gap}
      height={containerHeight}
      rowCount={rowsCount}
      rowHeight={itemHeight + gap}
      width={containerWidth}
      overscanRowCount={2}
      overscanColumnCount={1}
    >{Cell}</Grid>
  );
    }
  );

VirtualizedProductGrid.displayName = 'VirtualizedProductGrid';

export default VirtualizedProductGrid;