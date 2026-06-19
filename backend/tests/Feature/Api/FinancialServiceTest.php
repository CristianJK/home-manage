<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Services\FinancialService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinancialServiceTest extends TestCase
{
    use RefreshDatabase;

    private FinancialService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new FinancialService();
    }

    public function test_calculates_equal_shares_for_equal_salaries(): void
    {
        User::factory()->create(['salary' => 3000]);
        User::factory()->create(['salary' => 3000]);

        $result = $this->service->calculateProportionalShare(1000);

        $this->assertCount(2, $result);
        $this->assertEquals(500, $result[0]['share']);
        $this->assertEquals(500, $result[1]['share']);
        $this->assertEquals(50, $result[0]['percentage']);
        $this->assertEquals(50, $result[1]['percentage']);
    }

    public function test_calculates_proportional_shares_for_different_salaries(): void
    {
        User::factory()->create(['salary' => 6000]);
        User::factory()->create(['salary' => 2000]);

        $result = $this->service->calculateProportionalShare(800);

        $this->assertCount(2, $result);
        $this->assertEquals(600, $result[0]['share']);
        $this->assertEquals(200, $result[1]['share']);
        $this->assertEquals(75, $result[0]['percentage']);
        $this->assertEquals(25, $result[1]['percentage']);
    }

    public function test_returns_empty_array_when_total_salary_is_zero(): void
    {
        User::factory()->create(['salary' => 0]);
        User::factory()->create(['salary' => 0]);

        $result = $this->service->calculateProportionalShare(1000);

        $this->assertEmpty($result);
    }

    public function test_returns_empty_array_when_no_users(): void
    {
        $result = $this->service->calculateProportionalShare(1000);

        $this->assertEmpty($result);
    }

    public function test_single_user_gets_full_amount(): void
    {
        User::factory()->create(['salary' => 5000]);

        $result = $this->service->calculateProportionalShare(750);

        $this->assertCount(1, $result);
        $this->assertEquals(750, $result[0]['share']);
        $this->assertEquals(100, $result[0]['percentage']);
    }

    public function test_rounds_to_two_decimal_places(): void
    {
        User::factory()->create(['salary' => 3333]);
        User::factory()->create(['salary' => 3333]);
        User::factory()->create(['salary' => 3334]);

        $result = $this->service->calculateProportionalShare(100);

        $this->assertCount(3, $result);
        $this->assertEqualsWithDelta(33.33, $result[0]['share'], 0.01);
        $this->assertEqualsWithDelta(33.33, $result[1]['share'], 0.01);
        $this->assertEqualsWithDelta(33.34, $result[2]['share'], 0.01);
    }

    public function test_returns_correct_structure(): void
    {
        User::factory()->create(['salary' => 4000, 'name' => 'Alice']);

        $result = $this->service->calculateProportionalShare(500);

        $this->assertArrayHasKey('user_id', $result[0]);
        $this->assertArrayHasKey('name', $result[0]);
        $this->assertArrayHasKey('share', $result[0]);
        $this->assertArrayHasKey('percentage', $result[0]);
        $this->assertEquals('Alice', $result[0]['name']);
    }
}
