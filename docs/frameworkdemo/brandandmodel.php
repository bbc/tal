<?php
class BrandAndModel {

	private $model = "";
	private $brand = "";
	
	public function setBrand($brand) {
		$this->brand = $brand;
	}
	public function setModel($model) {
		$this->model = $model;
	}
	
	public function getBrand() {
		return $this->brand;
	}
	
	public function getModel() {
		return $this->model;
	}
}