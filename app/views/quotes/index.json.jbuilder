json.array!(@quotes) do |quote|
  json.extract! quote, :content, :attribution
  json.url quote_url(quote, format: :json)
end