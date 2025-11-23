-- Create the links table
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    URL TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the name column for faster searches
CREATE INDEX IF NOT EXISTS idx_links_name ON links(name);

-- Insert some sample data (optional)
-- INSERT INTO links (name, URL) VALUES 
--     ('Google', 'https://www.google.com'),
--     ('GitHub', 'https://www.github.com');

