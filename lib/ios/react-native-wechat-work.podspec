
require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']

  s.authors      = { "xinpure" => "xinpure@sina.cn" }
  s.homepage     = package['repository']['url']
  s.license      = package['license']

  s.platform     = :ios, "7.0"
  s.source       = { :git => package['repository']['url'] }
  s.source_files = '**/*.{h,m}'

  s.vendored_libraries = 'WXWorkApi/libWXWorkApi.a'

  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end
