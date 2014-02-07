WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.
  subscribe :echo, 'live_update#echo'
  subscribe :client_connected, :to => LiveUpdateController, :with_method => :client_connected
  subscribe :client_disconnected, :to => LiveUpdateController, :with_method => :client_disconnected
  subscribe :request_user_list, :to => LiveUpdateController, :with_method => :single_update_users
  subscribe :post_to_log, :to => LiveUpdateController, :with_method => :post_to_log
  subscribe :request_quotenum, :to => LiveUpdateController, :with_method => :quotenum_request
end
