
'use client'
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface Product {
    id: number;
    title: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    rating: number;
}

interface ApiResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
    key: keyof Product | null;
    direction: SortDirection;
}

const ProductDataTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
    const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: null
    });

    const [filters, setFilters] = useState({
        brand: new Set<string>(),
        category: new Set<string>(),
        priceRange: { min: '', max: '' },
    });
    useEffect(() => {
        fetchProducts();
    }, [currentPage, pageSize]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const skip = (currentPage - 1) * pageSize;
            let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;

            if (searchTerm) {
                url = `https://dummyjson.com/products/search?q=${searchTerm}&limit=${pageSize}&skip=${skip}`;
            }

            const response = await fetch(url);
            const data = await response.json() as ApiResponse;
            setProducts(data.products);

            const brands = [...new Set(data.products.map((p: Product) => p.brand))] as string[];
            const categories = [...new Set(data.products.map((p: Product) => p.category))] as string[];
            setUniqueBrands(brands);
            setUniqueCategories(categories);

            setTotalPages(Math.ceil(data.total / pageSize));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: keyof Product) => {
        let direction: SortDirection = 'asc';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }

        setSortConfig({ key, direction });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const setPriceRange = (min: string, max: string) => {
        setFilters({ ...filters, priceRange: { min, max } });
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const toggleCategoryFilter = (category: string) => {
        const newCategories = new Set(filters.category);
        if (newCategories.has(category)) {
            newCategories.delete(category);
        } else {
            newCategories.add(category);
        }
        setFilters({ ...filters, category: newCategories });
    };

    const toggleBrandFilter = (brand: string) => {
        const newBrands = new Set(filters.brand);
        if (newBrands.has(brand)) {
            newBrands.delete(brand);
        } else {
            newBrands.add(brand);
        }
        setFilters({ ...filters, brand: newBrands });
    };

    const getSortIcon = (key: keyof Product) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown className="h-4 w-4 ml-1" />;
        }
        if (sortConfig.direction === 'asc') {
            return <ChevronUp className="h-4 w-4 ml-1" />;
        }
        if (sortConfig.direction === 'desc') {
            return <ChevronDown className="h-4 w-4 ml-1" />;
        }
        return <ChevronsUpDown className="h-4 w-4 ml-1" />;
    };

    const sortData = (data: Product[]): Product[] => {
        if (!sortConfig.key || !sortConfig.direction) {
            return data;
        }
        return [...data].sort((a, b) => {
            if (a[sortConfig.key!] < b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key!] > b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredProducts = sortData(products.filter((product) => {
        const matchesBrand = filters.brand.size === 0 || filters.brand.has(product.brand);
        const matchesCategory = filters.category.size === 0 || filters.category.has(product.category);
        const matchesPrice = (!filters.priceRange.min || product.price >= Number(filters.priceRange.min)) &&
            (!filters.priceRange.max || product.price <= Number(filters.priceRange.max));
        return matchesBrand && matchesCategory && matchesPrice;
    }));

    const SortableHeader = ({ column }: { column: keyof Product }) => (
        <TableHead
            className={`cursor-pointer hover:bg-gray-100 ${column === 'price' || column === 'stock' || column === 'rating' ? 'text-right' : ''
                }`}
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center justify-between">
                <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                {getSortIcon(column)}
            </div>
        </TableHead>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4">
            <div className="flex items-center justify-between mb-4">
                <div className="w-full flex justify-between items-center gap-4">
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-x-3">
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-64"
                        />
                        <Button onClick={fetchProducts}>Search</Button>
                    </div>
                </div>
            </div>

            {/* Column Filters */}
            <div className="flex gap-4 mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Brand <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {uniqueBrands.map((brand) => (
                            <DropdownMenuCheckboxItem
                                key={`brand-${brand}`}  // Changed to ensure uniqueness
                                checked={filters.brand.has(brand)}
                                onCheckedChange={() => toggleBrandFilter(brand)}
                            >
                                {brand}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Category <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {uniqueCategories.map((category) => (
                            <DropdownMenuCheckboxItem
                                key={`category-${category}`}  // Changed to ensure uniqueness
                                checked={filters.category.has(category)}
                                onCheckedChange={() => toggleCategoryFilter(category)}
                            >
                                {category}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={filters.priceRange.min}
                        onChange={(e) => setPriceRange(e.target.value, filters.priceRange.max)}
                        className="w-24"
                        min={0}
                    />
                    <span>-</span>
                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={filters.priceRange.max}
                        onChange={(e) => setPriceRange(filters.priceRange.min, e.target.value)}
                        className="w-24"
                    />
                </div>
            </div>

            <div className="border rounded-lg min-w-1/2 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableHeader column="id" />
                            <SortableHeader column="title" />
                            <SortableHeader column="brand" />
                            <SortableHeader column="category" />
                            <SortableHeader column="price" />
                            <SortableHeader column="stock" />
                            <SortableHeader column="rating" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.id}</TableCell>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="text-right">${product.price}</TableCell>
                                <TableCell className="text-right">{product.stock}</TableCell>
                                <TableCell className="text-right">{product.rating}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredProducts.length * currentPage)} products
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        variant="outline"
                    >
                        Previous
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDataTable;