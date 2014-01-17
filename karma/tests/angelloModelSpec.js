describe('Service: angelloModel', function() {
		// load the service's module    
		beforeEach(module('Angello'));
		var modelService;
		// Initialize the service    
		beforeEach(inject(function(angelloModel) {
			modelService = angelloModel;
		}));
		describe('#getStatuses', function() { // write tests for angelloModel.getStatuses here    }); });
				it('should return seven different statuses', function() {
					expect(modelService.getStatuses().length).toBe(7);
				});
				it('should have a status named "To Do"', function() {
						expect(modelService.getStatuses().map(function(status) { // get just the name of each status   
								return status.name;
							})).toContain('To Do');
						});

				});
		});